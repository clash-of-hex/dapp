<template>
  <Popover class="relative bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="flex items-center justify-between border-b-2 border-gray-100 py-2 md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link
              to="/"
              aria-current="page"
              aria-label="Main page"
          >
            <span class="sr-only">HEX Battle</span>
            <img class="h-8 w-auto sm:h-10" src="@asset/logo.svg" alt="*"/>
          </router-link>
        </div>

        <PopoverGroup as="nav" class="hidden space-x-10 md:flex">
          <router-link
              to="/how-it-work"
              aria-current="page"
              aria-label="How it work"
              class="text-base font-medium text-gray-500 hover:text-gray-900">How it work</router-link>
        </PopoverGroup>

        <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <a href="#"
             class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Connect</a>
        </div>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import {Popover, PopoverButton, PopoverGroup, PopoverPanel} from '@headlessui/vue'
import {
  ArrowPathIcon,
  Bars3Icon,
  BookmarkSquareIcon,
  CalendarIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  LifebuoyIcon,
  PhoneIcon,
  PlayIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import {ChevronDownIcon} from '@heroicons/vue/20/solid'

const solutions = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of where your traffic is coming from.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers in a more meaningful way.',
    href: '#',
    icon: CursorArrowRaysIcon,
  },
  {name: 'Security', description: "Your customers' data will be safe and secure.", href: '#', icon: ShieldCheckIcon},
  {
    name: 'Integrations',
    description: "Connect with third-party tools that you're already using.",
    href: '#',
    icon: Squares2X2Icon,
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will drive your customers to convert',
    href: '#',
    icon: ArrowPathIcon,
  },
]
const callsToAction = [
  {name: 'Watch Demo', href: '#', icon: PlayIcon},
  {name: 'Contact Sales', href: '#', icon: PhoneIcon},
]
const resources = [
  {
    name: 'Help Center',
    description: 'Get all of your questions answered in our forums or contact support.',
    href: '#',
    icon: LifebuoyIcon,
  },
  {
    name: 'Guides',
    description: 'Learn how to maximize our platform to get the most out of it.',
    href: '#',
    icon: BookmarkSquareIcon,
  },
  {
    name: 'Events',
    description: 'See what meet-ups and other events we might be planning near you.',
    href: '#',
    icon: CalendarIcon,
  },
  {name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon},
]
const recentPosts = [
  {id: 1, name: 'Boost your conversion rate', href: '#'},
  {id: 2, name: 'How to use search engine optimization to drive traffic to your site', href: '#'},
  {id: 3, name: 'Improve your customer experience', href: '#'},
]
</script>