'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link'

interface VaultStats {
  totalValueLocked: string
  currentAPY: string
  totalShares: string
  userShares: string
  userETHValue: string
}

export default function HomePage() {
  const [stats, setStats] = useState<VaultStats>({
    totalValueLocked: '0',
    currentAPY: '0',
    totalShares: '0',
    userShares: '0',
    userETHValue: '0'
  })
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [quickDepositAmount, setQuickDepositAmount] = useState('')
  const [quickWithdrawAmount, setQuickWithdrawAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock contract address - replace with actual deployed address
  const VAULT_ADDRESS = '0x1234567890123456789012345678901234567890'

  useEffect(() => {
    loadVaultStats()
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setIsConnected(true)
        setAccount(accounts[0])
        await loadVaultStats()
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const loadVaultStats = async () => {
    try {
      // Mock data - replace with actual contract calls
      setStats({
        totalValueLocked: '1,250.75',
        currentAPY: '5.00',
        totalShares: '1,187.23',
        userShares: isConnected ? '15.5' : '0',
        userETHValue: isConnected ? '16.34' : '0'
      })
    } catch (error) {
      console.error('Error loading vault stats:', error)
    }
  }

  const quickDeposit = async () => {
    if (!quickDepositAmount || !isConnected) return
    
    setIsLoading(true)
    try {
      // Mock transaction - replace with actual contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Deposited ${quickDepositAmount} ETH successfully!`)
      setQuickDepositAmount('')
      await loadVaultStats()
    } catch (error) {
      console.error('Deposit error:', error)
      alert('Deposit failed!')
    } finally {
      setIsLoading(false)
    }
  }

  const quickWithdraw = async () => {
    if (!quickWithdrawAmount || !isConnected) return
    
    setIsLoading(true)
    try {
      // Mock transaction - replace with actual contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Withdrew ${quickWithdrawAmount} shares successfully!`)
      setQuickWithdrawAmount('')
      await loadVaultStats()
    } catch (error) {
      console.error('Withdraw error:', error)
      alert('Withdraw failed!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">YieldiVault</h1>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm text-gray-600">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>

        {/* Vault Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value Locked</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalValueLocked} ETH</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current APY</h3>
            <p className="text-3xl font-bold text-green-600">{stats.currentAPY}%</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Shares</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalShares}</p>
          </div>
        </div>

        {/* User Stats (if connected) */}
        {isConnected && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Shares</h3>
              <p className="text-2xl font-bold text-indigo-600">{stats.userShares} YVS</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your ETH Value</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.userETHValue} ETH</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Deposit</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Amount in ETH"
                value={quickDepositAmount}
                onChange={(e) => setQuickDepositAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.001"
                min="0.001"
              />
              <button
                onClick={quickDeposit}
                disabled={!isConnected || !quickDepositAmount || isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Deposit ETH'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Withdraw</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Shares to withdraw"
                value={quickWithdrawAmount}
                onChange={(e) => setQuickWithdrawAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.001"
                min="0"
              />
              <button
                onClick={quickWithdraw}
                disabled={!isConnected || !quickWithdrawAmount || isLoading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Withdraw Shares'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/deposit"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <h4 className="font-semibold text-gray-800 mb-2">Detailed Deposit</h4>
            <p className="text-gray-600 text-sm">Advanced deposit options with preview</p>
          </Link>

          <Link
            href="/withdraw"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <h4 className="font-semibold text-gray-800 mb-2">Withdraw</h4>
            <p className="text-gray-600 text-sm">Manage your withdrawals</p>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <h4 className="font-semibold text-gray-800 mb-2">Dashboard</h4>
            <p className="text-gray-600 text-sm">Personal vault statistics</p>
          </Link>
          // asdasd

          <Link
            href="/analytics"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <h4 className="font-semibold text-gray-800 mb-2">Analytics</h4>
            <p className="text-gray-600 text-sm">Performance metrics and insights</p>
          </Link>
        </div>
      </div>
    </div>
  )
}