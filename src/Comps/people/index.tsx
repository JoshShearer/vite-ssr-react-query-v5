import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '#src/api/users'
import { User } from '#src/types/api/User'
import './code.css'

export const Comps_people = () => {
  const { data, isPending } = useQuery<User[]>({
    queryKey: ['usersAbout'],
    queryFn: getUsers
  })

  console.log(isPending)
  return (
    <>
      <h1>About</h1>
      <p>
        Demo using <code>vike</code> V1.
      </p>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}
