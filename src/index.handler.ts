import { eventsHandler } from './lambda/events-handler'
import { functionUrlHandler } from './lambda/webapp-handler'
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  Callback,
  Context,
  EventBridgeEvent,
  EventBridgeHandler,
} from 'aws-lambda'

const isApiGatewayProxyEvent = (
  event: APIGatewayProxyEventV2 | EventBridgeEvent<string, unknown>
): event is APIGatewayProxyEventV2 => event.version === '2.0'

const isEventBridgeEvent = (
  event: APIGatewayProxyEventV2 | EventBridgeEvent<string, unknown>
): event is EventBridgeEvent<string, unknown> => event.version === '0'

export const handler:
  | APIGatewayProxyHandlerV2
  | EventBridgeHandler<string, unknown, unknown> = async (
  event: APIGatewayProxyEventV2 | EventBridgeEvent<string, unknown>,
  context: Context,
  callback: Callback
) => {
  if (isApiGatewayProxyEvent(event)) {
    return await functionUrlHandler(event, context, callback)
  } else if (isEventBridgeEvent(event)) {
    return await eventsHandler(event, context, callback)
  }

  return null
}
