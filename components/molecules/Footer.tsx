'use client'

import { FaGithub, FaLinkedin } from 'react-icons/fa'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

import blackLogo from '@/public/black_DIX31.png'
import whitelogo from '@/public/white_DIX31.png'

export function Footer() {
  const { resolvedTheme } = useTheme()
  const dix31 = resolvedTheme === 'dark' ? whitelogo : blackLogo
  const year = new Date().getFullYear()

  return (
    <footer className="text-gray-900 bg-gray-200 dark:bg-slate-700 dark:text-slate-300">
      <div className="bg-gray-100 dark:bg-black py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-xs md:text-sm text-center md:text-left">
              <span>{year} Created by</span>
              <Link
                href="https://www.dix31.com"
                target="_blank"
                className="mx-1 hover:underline inline-flex items-center"
              >
                <Image
                  src={dix31}
                  alt="Logo DIX31.com"
                  height={15}
                  className="mr-1"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="https://www.linkedin.com/in/xavier%F0%9F%92%BB-genolhac-79a98390/"
                target="_blank"
                className="text-gray-500 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-500"
              >
                <FaLinkedin size={20} />
              </Link>
              <Link
                href="https://github.com/koala819/"
                target="_blank"
                className="text-gray-500 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-500"
              >
                <FaGithub size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
