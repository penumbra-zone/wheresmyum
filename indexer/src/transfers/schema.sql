CREATE TABLE IF NOT EXISTS wmu_transfers (
    rowid SERIAL PRIMARY KEY,
    -- The channel the transfer is being initiated on.
    channel TEXT NOT NULL,
    -- The packet sequence number for the channel.
    sequence BIGINT NOT NULL,
    -- The bytes of the asset being transferred.
    asset_id BYTEA NOT NULL,
    -- The value amount being transferred.
    amount NUMERIC(39) NOT NULL,
    -- The sender's penumbra address.
    sender BYTEA NOT NULL,
    -- The receiver's address, whose format we make no assumption about.
    receiver TEXT NOT NULL,
    -- The block height where the transfer happened
    height BIGINT NOT NULL,
    -- The bytes of the transaction that resulted in this transfer.
    --
    -- In practice this will always be present, but we shouldn't necessarily assume this.
    tx BYTEA
);

-- We often want to search for transfers along a particular channel.
CREATE UNIQUE INDEX ON wmu_transfers (channel, sequence);
