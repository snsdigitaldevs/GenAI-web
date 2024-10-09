export default function NoPermission() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">No Permission</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page. Please contact administrator.
        </p>
      </div>
    </div>
  );
}