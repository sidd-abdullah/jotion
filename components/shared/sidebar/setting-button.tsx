import { Settings } from 'lucide-react'

import ThemeToggle from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function SettingButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'custom'} size={'sm'} className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Settings</DialogTitle>
          <DialogDescription>
            Adjust the appearance of Noted to suit your preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <span className="text-base">
              Customize how Noted looks on your device
            </span>
          </div>
          <ThemeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
