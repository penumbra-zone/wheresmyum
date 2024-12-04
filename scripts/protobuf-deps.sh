find protobuf/gen -type f | while read file; do
  sed -i "s|\(\.\./\)*penumbra|@penumbra-zone/protobuf/penumbra|g" $file
done
