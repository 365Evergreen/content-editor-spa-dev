import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SignInPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    // ✅ Prefer explicitly provided return target
    let returnTo = params.get('returnTo')

    if (!returnTo || returnTo === '/signin') {
      const currentPath = location.pathname + location.search

      // ✅ Prevent redirect loop
      if (location.pathname === '/signin') {
        returnTo = '/'
      } else {
        returnTo = currentPath
      }
    }

    const loginUrl =
      `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(returnTo)}`

    const checkAuthentication = async () => {
      try {
        const response = await fetch('/.auth/me', { cache: 'no-store' })
        if (response.ok) {
          navigate('/editor', { replace: true })
          return
        }
      } catch (error) {
        console.warn('Auth check failed:', error)
      }

      window.location.assign(loginUrl)
    }

    checkAuthentication()
  }, [location.pathname, location.search, navigate])

  return (
    <div className="page-shell page-shell--narrow">
      <section className="content-block">
        <p className="lead">Redirecting to sign-in…</p>
      </section>
    </div>
  )
}
