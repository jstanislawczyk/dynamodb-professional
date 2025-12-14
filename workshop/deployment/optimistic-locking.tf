resource "aws_dynamodb_table" "optimistic_locking" {
  name         = "${local.project}-optimistic-locking"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
