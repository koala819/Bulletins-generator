'use client'

import { Home, Menu } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('header')
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled')
      } else {
        navbar?.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const closeSheet = () => setIsSheetOpen(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Home />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/conf" legacyBehavior passHref>
                  <NavigationMenuLink className="px-3 py-2">
                    Configuration
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/item1" legacyBehavior passHref>
                  <NavigationMenuLink className="px-3 py-2">
                    Phase 2
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/students" legacyBehavior passHref>
                  <NavigationMenuLink className="px-3 py-2">
                    Elèves
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="outline">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <nav className="flex flex-col space-y-4">
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  href="/conf"
                  onClick={closeSheet}
                >
                  Configuration
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  href="/item2"
                  onClick={closeSheet}
                >
                  Phase 2
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  href="/students"
                  onClick={closeSheet}
                >
                  Elèves
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
