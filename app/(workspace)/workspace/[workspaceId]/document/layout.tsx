import DocumentSidebar from '@/components/shared/sidebar/document-sidebar'
import MobileSidebar from '@/components/shared/sidebar/mobile-sidebar'
import WorkspaceSidebar from '@/components/shared/workspace/workspace-sidebar'

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="w-[72px] min-h-screen hidden md:flex fixed inset-y-0 z-40">
        <WorkspaceSidebar />
      </div>
      <div className="w-72 min-h-screen hidden md:flex fixed inset-y-0 z-30 pl-[72px]">
        <DocumentSidebar />
      </div>
      <main className="md:pl-[288px] min-h-screen bg-white dark:bg-[#36393f]">
        <MobileSidebar />
        {children}
      </main>
    </div>
  )
}
