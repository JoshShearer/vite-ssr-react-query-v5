import React from 'react'
import { getUsers } from '../../api/users'

import { Comps_people } from '../../Comps/people'

export { Page, prefetchQueries }

const prefetchQueries = {
  'usersAbout': {
    fn: getUsers,
  }
}

function Page() {

  return (
    <>
      <Comps_people />
    </>
  )
}
