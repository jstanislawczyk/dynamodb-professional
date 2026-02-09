resource "aws_dynamodb_table" "composite_key" {
  name         = "${local.project}-composite-key"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "documentId"
  range_key    = "version"

  attribute {
    name = "documentId"
    type = "S"
  }

  attribute {
    name = "teamId"
    type = "S"
  }

  attribute {
    name = "version"
    type = "N"
  }

  attribute {
    name = "title"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "N"
  }

  local_secondary_index {
    name            = "TITLE_LSI"
    range_key       = "title"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "TEAM_GSI"
    hash_key        = "teamId"
    range_key       = "createdAt"
    projection_type = "ALL"
  }
}
