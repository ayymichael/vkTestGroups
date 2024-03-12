import {  useState, useEffect } from 'react'
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  usePlatform,
  PanelHeaderBack,
  Avatar,
  Button,
  FormItem,
  CustomSelect,
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import { GroupType, User, fetchGroups } from './api'

function App() {
  const [groups, setGroups] = useState<GroupType[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupType>({
    id: 1,
    name: '',
    closed: false,
    members_count: 1,
  })
  const platform = usePlatform()
  const [activePanel, setActivePanel] = useState('list')
  const [sortPrivate, setSortPrivate] = useState<string>('все')
  const sortPrivateTypes = ['все', 'открытая', 'закрытая']
  const [sortColor, setSortColor] = useState<string>('any')
  const colors = [
    'any',
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'orange',
  ]
  const [sortSubscribed, setSortSubscribed] = useState<string>('не важно')
  const subscribedFriendsChoices = ['не важно', 'да', 'нет']
  const [errorMarker, setErrorMarker] = useState(false)

  const selectFriends = (id: number) => {
    const found = groups.find((group) => group.id === id)
    if (found) {
      setSelectedGroup(found)
    }
    setActivePanel('friends')
  }

  useEffect(() => {
    fetchGroups().then((res) => {
      if (res.data) {
        setGroups(res.data)
      }
    }).catch((err) => setErrorMarker(true))
  }, [])

  return (
    <div className="App">
      <header className="App-header"></header>
      <AppRoot>
        <SplitLayout
          header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}
        >
          <SplitCol autoSpaced>
            <View activePanel={activePanel}>
              <Panel id="list">
                <PanelHeader>VK GROUPS</PanelHeader>
                <Group header={<Header mode="secondary">Сортировка</Header>}>
                  <FormItem top="По типу группы">
                    <CustomSelect
                      value={sortPrivate}
                      options={sortPrivateTypes.map((privateType) => ({
                        label: privateType,
                        value: privateType,
                      }))}
                      onChange={(event) => setSortPrivate(event.target.value)}
                    />
                  </FormItem>
                  <FormItem top="По цвету аватарки">
                    <CustomSelect
                      value={sortColor}
                      options={colors.map((color) => ({
                        label: color,
                        value: color,
                      }))}
                      onChange={(event) => setSortColor(event.target.value)}
                    />
                  </FormItem>
                  <FormItem top="Подписаны друзья">
                    <CustomSelect
                      value={sortSubscribed}
                      options={subscribedFriendsChoices.map((choice) => ({
                        label: choice,
                        value: choice,
                      }))}
                      onChange={(event) =>
                        setSortSubscribed(event.target.value)
                      }
                    />
                  </FormItem>
                </Group>
                {!errorMarker ? (
                  <Group header={<Header mode="secondary">Группы</Header>}>
                  {groups
                    .filter((group) => {
                      if (sortPrivate === 'все') return true
                      if (sortPrivate === 'закрытая') {
                        return group.closed
                      }
                      return !group.closed
                    })
                    .filter((group) => {
                      if (sortColor === 'any') return true
                      return group.avatar_color === colors.find(color => color === sortColor)
                    })
                    .filter((group) => {
                      if (sortSubscribed === 'не важно') return true
                      if (sortSubscribed === 'нет') return !group.friends?.length
                      return group.friends?.length
                    })
                    .map((group) => {
                      return (
                        <SimpleCell
                          key={`${group.id}${group.name}`}
                          before={
                            <Avatar
                              size={40}
                              style={{ backgroundColor: group.avatar_color }}
                            />
                          }
                          after={
                            group.friends && (
                              <Button
                                align={'center'}
                                size={'m'}
                                appearance={'accent'}
                                onClick={() => selectFriends(group.id)}
                              >
                                {`Друзей подписано: ${group.friends.length}`}
                              </Button>
                            )
                          }
                          subtitle={group.closed ? 'Закрытая' : 'Открытая'}
                          extraSubtitle={`Подписчики: ${group.members_count}`}
                        >
                          {group.name}
                        </SimpleCell>
                      )
                    })}
                </Group>
                ) : (
                  <Group header={<Header mode="secondary">Ошибка при загрузке данных</Header>}></Group>
                )}
              </Panel>
              {selectedGroup.friends ? (
                <Panel id="friends">
                  <PanelHeader
                    before={
                      <PanelHeaderBack onClick={() => setActivePanel('list')} />
                    }
                  >
                    VK Groups
                  </PanelHeader>
                  <Group header={<Header mode="secondary">Друзья</Header>}>
                    {selectedGroup.friends.map((user: User, index) => (
                      <SimpleCell
                        key={`${index}-${user.first_name}-${user.last_name}`}
                      >
                        {user.first_name}
                      </SimpleCell>
                    ))}
                  </Group>
                </Panel>
              ) : (
                <Panel id="friends">
                  <PanelHeader
                    before={
                      <PanelHeaderBack onClick={() => setActivePanel('list')} />
                    }
                  >
                    VK Groups
                  </PanelHeader>
                  Нет подписанных друзей
                </Panel>
              )}
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </div>
  )
}

export default App
