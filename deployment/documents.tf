resource "aws_dynamodb_table" "documents" {
  name         = "${local.project}-documents"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "version"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "version"
    type = "N"
  }

  attribute {
    name = "name"
    type = "S"
  }

  local_secondary_index {
    name            = "NAME_LSI"
    projection_type = "ALL"
    range_key       = "name"
  }
}
