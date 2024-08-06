export type FormDataTopConfig = {
  fields: {
    name: string
    value: string
  }[]
}

export type Item = {
  [key: string]: any
}

export type StudentsProps = {
  title: string
  description: string
}

export type TableColumn = {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: any
  pk: number
}
