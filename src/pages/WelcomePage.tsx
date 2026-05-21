import { Link } from 'react-router-dom'

export function WelcomePage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to ChatApp</h2>
        <p className="text-gray-400 text-sm mb-6">
          Select a chat room from the sidebar, view{' '}
          <Link to="/articles" className="text-indigo-400 hover:underline">AI Articles</Link>, or start a{' '}
          <Link to="/dm" className="text-indigo-400 hover:underline">Direct Message</Link>.
        </p>
      </div>
    </div>
  )
}
