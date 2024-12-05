use clap::Parser as _;
use wheresmyum_indexer::augment_indexer;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let opts = pindexer::Options::parse();
    let indexer = pindexer::Indexer::new(opts)
        .with_index(Box::new(pindexer::block::Block {}))
        .with_default_tracing();
    augment_indexer(indexer).run().await
}
