import { prisma } from "../src/builder"

async function main() {
    return await prisma.user.create({
        data: {
            name: 'hello',
            email: 'monnn',
        }
    }).then(() => console.log('done'))
    .catch((error) => console.log(`error ${error.message}`) )
}

main()
