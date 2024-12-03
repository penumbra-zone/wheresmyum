use cometindex::{async_trait, index::EventBatch};
use pindexer::{AppView, PgTransaction};

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
        _dbtx: &mut PgTransaction,
        _app_state: &serde_json::Value,
    ) -> Result<(), anyhow::Error> {
        todo!()
    }

    /// This allows processing a batch of events, over many blocks.
    ///
    /// By using a batch, we can potentially avoid a costly
    async fn index_batch(
        &self,
        _dbtx: &mut PgTransaction,
        _batch: EventBatch,
    ) -> Result<(), anyhow::Error> {
        todo!()
    }
}
