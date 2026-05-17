export default function CMSPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dynamic CMS Editor</h1>
        <p className="text-muted-foreground">Select a page and section to edit dynamic content.</p>
      </div>
      <div className="p-12 border border-dashed rounded-3xl text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50">
        <p className="font-bold">CMS Editor Component is not installed or has been migrated.</p>
        <p className="text-sm mt-2">Please use the Content Controller tab in the sidebar to manage pages and items.</p>
      </div>
    </div>
  )
}
