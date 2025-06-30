resource "aws_dynamodb_table" "users" {
  name         = "${local.project}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  global_secondary_index {
    hash_key        = "teamId"
    name            = "TEAM_ID_GSI"
    projection_type = "ALL"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "teamId"
    type = "S"
  }
}
