use pindexer::Indexer;

mod transfers;

/// Add the relevant app views to a given indexer.
pub fn augment_indexer(indexer: Indexer) -> Indexer {
    indexer.with_index(Box::new(transfers::Component::default()))
}
