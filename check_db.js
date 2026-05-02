
const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://admin:GTVjJqksmRUVtSwoDnxzzPBWGhj@40.192.115.252:27017/betopia_group?authSource=admin&directConnection=true";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('betopia_group');
        const ventures = await db.collection('page_ventures').find({}).toArray();
        console.log('Total ventures:', ventures.length);
        if (ventures.length > 0) {
            console.log('Sample venture:', JSON.stringify(ventures[0], null, 2));
        }

        const content = await db.collection('page_data').findOne({ page: 'ventures' });
        console.log('Ventures page data:', JSON.stringify(content, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
