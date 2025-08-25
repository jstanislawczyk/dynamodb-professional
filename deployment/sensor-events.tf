resource "aws_dynamodb_table" "sensor_events" {
  name         = "${local.project}-sensor-events"
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

  attribute {
    name = "ALARM_GSI_PK"
    type = "S"
  }

  global_secondary_index {
    name            = "SENSOR_STATUS_GSI"
    hash_key        = "SENSOR_STATUS_GSI_PK"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "ALARM_GSI"
    hash_key        = "ALARM_GSI_PK"
    range_key       = "createdAt"
    projection_type = "ALL"
  }
}
