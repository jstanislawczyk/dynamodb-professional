resource "aws_dynamodb_table" "sharding" {
  name         = "${local.project}-sharding"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"

  attribute {
    name = "PK"
    type = "S"
  }
}
