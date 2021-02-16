import { IApp } from '@/models/App/App'

const store: {
  apps: Record<string, IApp>
  currentApp?: IApp
} = {
  apps: {},
}

export default store