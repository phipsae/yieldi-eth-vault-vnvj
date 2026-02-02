'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DepositPreview {
  ethAmount: string
  expectedShares: string
  pricePerShare: string
  estimatedAPY: string
  minimumDeposit: string
}

export default function DepositPage() {
  const [depositAmount, setDepositAmount] = useState('')
  const [preview, setPreview] = useState<DepositPreview>({
    ethAmount: '0',
    expectedShares: '0',
    pricePerShare: '1.0543',
    estimatedAPY: '5.00',
    minimumDeposit: '0.001'
  })
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [balance, setBalance] = useState('0')

  useEffect(() => {
    checkWalletConnection()
  }, [])

  useEffect(() => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      calculatePreview()
    } else {
      setPreview(prev => ({
        ...prev,
        ethAmount: '0',
        expectedShares: '0'
      }))
    }
  }, [depositAmount])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0])
          await getBalance(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const getBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      const ethBalance = parseInt(balance, 16) / Math.pow(10, 18)
      setBalance(ethBalance.toFixed(4))
    } catch (error) {
      console.error('Error getting balance:', error)
    }
  }

  const calculatePreview = () => {
    const amount = parseFloat(depositAmount)
    const sharePrice = parseFloat(preview.pricePerShare)
    const expectedShares = amount / sharePrice
    
    setPreview(prev => ({
      ...prev,
      ethAmount: depositAmount,
      expectedShares: expectedShares.toFixed(6)
    }))
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setIsConnected(true)
        setAccount(accounts[0])
        await getBalance(accounts[0])
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const handleMaxClick = () => {
    const maxAmount = Math.max(0, parseFloat(balance) - 0.01) // Leave some for gas
    setDepositAmount(maxAmount.toFixed(4))
  }

  const isValidAmount = () => {
    const amount = parseFloat(depositAmount)
    return amount >= parseFloat(preview.minimumDeposit) && amount <= parseFloat(balance)
  }

  const executeDeposit = async () => {
    if (!isValidAmount() || !isConnected) return

    setIsLoading(true)
    try {
      // Mock transaction - replace with actual contract interaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert(`Successfully deposited ${depositAmount} ETH and received ${preview.expectedShares} YVS shares!`)
      setDepositAmount('')
      await getBalance(account)
    } catch (error) {
      console.error('Deposit error:', error)
      alert('Deposit failed!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Vault
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Deposit ETH</h1>
          </div>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-right">
              <div className="text-sm text-gray-600">Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
              <div className="text-sm font-semibold text-gray-800">Balance: {balance} ETH</div>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Deposit Form */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Deposit Amount</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ETH Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={`Minimum ${preview.minimumDeposit} ETH`}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-4 pr-16 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.001"
                    min={preview.minimumDeposit}
                  />
                  <button
                    onClick={handleMaxClick}
                    disabled={!isConnected}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200 disabled:opacity-50"
                  >
                    MAX
                  </button>
                </div>
                {depositAmount && !isValidAmount() && (
                  <p className="text-red-600 text-sm mt-1">
                    {parseFloat(depositAmount) < parseFloat(preview.minimumDeposit)
                      ? `Minimum deposit is ${preview.minimumDeposit} ETH`
                      : 'Insufficient balance'
                    }
                  </p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2">
                {['0.1', '0.5', '1.0', '2.0'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction Preview */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction Preview</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Deposit Amount:</span>
                <span className="font-semibold">{preview.ethAmount} ETH</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Expected Shares:</span>
                <span className="font-semibold">{preview.expectedShares} YVS</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Price per Share:</span>
                <span className="font-semibold">{preview.pricePerShare} ETH</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Estimated APY:</span>
                <span className="font-semibold text-green-600">{preview.estimatedAPY}%</span>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your ETH will be deposited into the vault</li>
                  <li>• You'll receive YVS shares representing your ownership</li>
                  <li>• Shares automatically earn yield at {preview.estimatedAPY}% APY</li>
                  <li>• You can withdraw anytime by redeeming your shares</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Deposit Button */}
          <button
            onClick={executeDeposit}
            disabled={!isConnected || !isValidAmount() || isLoading || !depositAmount}
            className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Deposit...</span>
              </div>
            ) : (
              `Deposit ${depositAmount || '0'} ETH`
            )}
          </button>

          {!isConnected && (
            <p className="text-center text-gray-600 mt-4">
              Please connect your wallet to deposit
            </p>
          )}
        </div>
      </div>
    </div>
  )
}