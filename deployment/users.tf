resource "aws_dynamodb_table" "users" {
  name         = "${local.project}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "N"
  }

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "teamId"
    type = "S"
  }

  local_secondary_index {
    name            = "CREATED_AT_LSI"
    projection_type = "ALL"
    range_key       = "createdAt"
  }

  local_secondary_index {
    name            = "EMAIL_LSI"
    projection_type = "ALL"
    range_key       = "email"
  }

  global_secondary_index {
    hash_key        = "teamId"
    name            = "TEAM_ID_GSI"
    projection_type = "ALL"
  }
}
