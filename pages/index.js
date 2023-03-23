// pages/index.js

import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1>Index page</h1>
      <hr />
      <ul>
        <li>
          <Link href="/stuff/1">go to 1</Link>
        </li>
        <li>
          <Link href="/stuff/2">go to 2</Link>
        </li>
      </ul>
    </>
  );
}