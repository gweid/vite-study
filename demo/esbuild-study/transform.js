const { transform } = require('esbuild')

async function runTransform() {
  const result = await transform(
    "const getFullName = (firstName: string, lastName: string): string => firstName + lastName",
    {
      sourcemap: false,
      loader: 'ts'
    }
  )

  console.log(result)
}

runTransform()
