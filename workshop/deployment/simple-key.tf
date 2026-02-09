resource "aws_dynamodb_table" "simple_key" {
  name         = "${local.project}-simple-key"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
