use cometindex::{
    async_trait,
    index::EventBatch,
    sqlx::{self, types::BigDecimal},
};
use penumbra_proto::event::EventDomainType;
use penumbra_shielded_pool::event::EventOutboundFungibleTokenTransfer;
use pindexer::{AppView, PgTransaction};

struct Ctx<'a, 'db> {
    dbtx: &'a mut PgTransaction<'db>,
}

impl<'a, 'db> Ctx<'a, 'db> {
    fn new(dbtx: &'a mut PgTransaction<'db>) -> Self {
        Self { dbtx }
    }

    async fn index_outbound_transfer(
        &mut self,
        height: u64,
        e: EventOutboundFungibleTokenTransfer,
        tx: Option<[u8; 32]>,
    ) -> anyhow::Result<()> {
        sqlx::query("INSERT INTO wmu_transfers VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8)")
            .bind(e.meta.channel)
            .bind(i64::try_from(e.meta.sequence)?)
            .bind(e.value.asset_id.to_bytes())
            .bind(BigDecimal::from(e.value.amount.value()))
            .bind(e.sender.to_vec())
            .bind(e.receiver)
            .bind(i64::try_from(height)?)
            .bind(tx)
            .execute(self.dbtx.as_mut())
            .await?;
        Ok(())
    }
}

#[derive(Default)]
pub struct Component {}

#[async_trait]
impl AppView for Component {
    /// Return the name of this index.
    ///
    /// This should be unique across all of the indices.
    fn name(&self) -> String {
        "wmu_transfers".to_string()
    }

    /// This will be called once when processing the genesis before the first block.
    async fn init_chain(
        &self,
        dbtx: &mut PgTransaction,
        _app_state: &serde_json::Value,
    ) -> Result<(), anyhow::Error> {
        for statement in include_str!("schema.sql").split(";") {
            sqlx::query(statement).execute(dbtx.as_mut()).await?;
        }
        Ok(())
    }

    /// This allows processing a batch of events, over many blocks.
    ///
    /// By using a batch, we can potentially avoid a costly
    async fn index_batch(
        &self,
        dbtx: &mut PgTransaction,
        batch: EventBatch,
    ) -> Result<(), anyhow::Error> {
        let mut ctx = Ctx::new(dbtx);
        for event in batch.events() {
            if let Ok(e) = EventOutboundFungibleTokenTransfer::try_from_event(&event.event) {
                ctx.index_outbound_transfer(event.block_height, e, event.tx_hash)
                    .await?;
            }
        }
        Ok(())
    }
}
