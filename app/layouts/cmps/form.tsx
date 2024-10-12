export function Form({
  action,
  children,
}: {
  action: any;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      className="flex flex-col space-y-4  py-8 sm:px-16 bg-theme-light dark:bg-darkmode-theme-light"
    >
      <div>
        <label htmlFor="email" className="block text-xs  uppercase">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none  sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-xs  uppercase">
          Full Name
        </label>
        <input
          id="username"
          name="username"
          type="username"
          placeholder="Israel Israeli"
          required
          className="mt-1 block w-full appearance-none rounded-md border  px-3 py-2  shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs uppercase">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      {children}
    </form>
  );
}
