resource "aws_dynamodb_table" "users" {
  name         = "${local.project}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
