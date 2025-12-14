resource "aws_dynamodb_table" "alarms_all" {
  name         = "${local.project}-alarms-all"
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
    name = "SENSOR_STATUS_GSI_PK"
    type = "S"
  }

  global_secondary_index {
    name            = "SENSOR_STATUS_GSI"
    hash_key        = "SENSOR_STATUS_GSI_PK"
    range_key       = "createdAt"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "alarms_sparse" {
  name         = "${local.project}-alarms-sparse"
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
    name = "ALARM_GSI_PK"
    type = "S"
  }

  global_secondary_index {
    name            = "ALARM_GSI"
    hash_key        = "ALARM_GSI_PK"
    range_key       = "createdAt"
    projection_type = "ALL"
  }
}

