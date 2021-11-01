import { HeaderTitleWrapper } from '@platyplus/layout'
import { Link, Redirect } from 'react-router-dom'
import { useAuthenticated } from '@platyplus/hbp'
import { useAppConfig } from '@platyplus/react-rxdb-hasura'

export const IndexPage: React.FC<{ title?: string }> = ({
  title = 'Index page'
}) => {
  const signedIn = useAuthenticated()
  const [appConfig] = useAppConfig()
  if (signedIn) {
    if (appConfig) return <Redirect from="/" to={appConfig.home || '/home'} />
    else return null
  } else
    return (
      <HeaderTitleWrapper title={title}>
        <h2>Welcome, stranger</h2>
        <Link to="/login">Login</Link>
        <br />
        <Link to="/register">Register</Link>
      </HeaderTitleWrapper>
    )
}

export default IndexPage
