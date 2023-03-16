/* eslint-disable no-console */
import { eventsHandler } from './lambda/events-handler'
import { functionUrlHandler } from './lambda/webapp-handler'
import type {
  APIGatewayProxyEventV2,
  Callback,
  Context,
  EventBridgeEvent,
  Handler,
} from 'aws-lambda'

type HandlerEvents =
  | APIGatewayProxyEventV2
  | EventBridgeEvent<string, unknown>
  | Record<string, unknown>
  | {}

const isApiGatewayProxyEvent = (
  event: HandlerEvents
): event is APIGatewayProxyEventV2 =>
  'version' in event && event.version === '2.0'

const isEventBridgeEvent = (
  event: HandlerEvents
): event is EventBridgeEvent<string, unknown> =>
  'version' in event && event.version === '0'

export const handler: Handler = async (
  event: HandlerEvents,
  context: Context,
  callback: Callback
) => {
  if (isApiGatewayProxyEvent(event)) {
    return await functionUrlHandler(event, context, callback)
  } else if (isEventBridgeEvent(event)) {
    return await eventsHandler(event, context, callback)
  } else {
    console.error('Unknown event type', event)
    console.log(JSON.stringify(event, null, 2))
  }

  return null
}
