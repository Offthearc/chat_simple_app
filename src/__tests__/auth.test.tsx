import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'

const mockSignIn = vi.fn()
const mockSignUp = vi.fn()

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    user: null,
    profile: null,
    loading: false,
    signOut: vi.fn(),
  }),
}))

describe('LoginForm', () => {
  const onSwitch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockSignIn.mockResolvedValue({ error: null })
  })

  it('renders email and password fields', () => {
    render(<LoginForm onSwitch={onSwitch} />)
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument()
  })

  it('calls signIn with correct credentials on submit', async () => {
    render(<LoginForm onSwitch={onSwitch} />)
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'user@test.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@test.com', 'password123')
    })
  })

  it('shows error when signIn fails', async () => {
    mockSignIn.mockResolvedValue({ error: 'Invalid credentials' })
    render(<LoginForm onSwitch={onSwitch} />)
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'bad@test.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
    })
  })

  it('calls onSwitch when register link is clicked', () => {
    render(<LoginForm onSwitch={onSwitch} />)
    fireEvent.click(screen.getByText('Create one'))
    expect(onSwitch).toHaveBeenCalledOnce()
  })
})

describe('RegisterForm', () => {
  const onSwitch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockSignUp.mockResolvedValue({ error: null })
  })

  it('renders all registration fields', () => {
    render(<RegisterForm onSwitch={onSwitch} />)
    expect(screen.getByTestId('username-input')).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
  })

  it('validates username length', async () => {
    render(<RegisterForm onSwitch={onSwitch} />)
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'ab' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('at least 3 characters')
    })
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('calls signUp with correct data', async () => {
    render(<RegisterForm onSwitch={onSwitch} />)
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@test.com', 'password123', 'testuser')
    })
  })

  it('shows success message after registration', async () => {
    render(<RegisterForm onSwitch={onSwitch} />)
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(screen.getByText('Account created!')).toBeInTheDocument()
    })
  })

  it('shows error when signUp fails', async () => {
    mockSignUp.mockResolvedValue({ error: 'Email already registered' })
    render(<RegisterForm onSwitch={onSwitch} />)
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'dup@test.com' } })
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email already registered')
    })
  })
})
