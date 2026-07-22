import { useMemo } from 'react'
import { useTypedWamData } from '@channel.io/app-sdk-wam'
import { TutorialWamDataSchema, type TutorialWamData } from '@tutorial/shared'

export interface TutorialWamDataResult {
  data: TutorialWamData | null
  error: Error | null
}

export function useTutorialWamData(): TutorialWamDataResult {
  const appId = useTypedWamData('appId')
  const channelId = useTypedWamData('channelId')
  const managerId = useTypedWamData('managerId')
  const chatId = useTypedWamData('chatId')
  const chatType = useTypedWamData('chatType')
  const chatTitle = useTypedWamData('chatTitle')
  const rootMessageId = useTypedWamData('rootMessageId')
  const broadcast = useTypedWamData('broadcast')
  const message = useTypedWamData('message')
  const targetToken = useTypedWamData('targetToken')

  return useMemo(() => {
    const parsed = TutorialWamDataSchema.safeParse({
      appId,
      channelId,
      managerId,
      chatId,
      chatType,
      chatTitle,
      rootMessageId,
      broadcast,
      message,
      targetToken,
    })

    if (parsed.success) {
      return { data: parsed.data, error: null }
    }

    return {
      data: null,
      error: new Error(
        'The host did not provide the expected tutorial WAM data.'
      ),
    }
  }, [
    appId,
    broadcast,
    channelId,
    chatId,
    chatTitle,
    chatType,
    managerId,
    message,
    rootMessageId,
    targetToken,
  ])
}
