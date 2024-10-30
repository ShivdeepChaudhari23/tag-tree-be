import con from '../utils/db.js';
import { addTag } from '../utils/helper.js';

export const getTree = async (req, res) => {
    try {
        const query = 'SELECT * FROM tree';
        const [results] = await con.query(query);
        return res.status(200).json({ data: { treeList: results.length > 0 ? results : []} })
    } catch (e) {
        console.error(e);
    }
}

export const postTree = async (req, res) => {
    try {
        await con.beginTransaction();

        //1. Truncate Existing Table (Since we don't have id's now for any tag,
        //it will be easier to truncate and add all elements again and create the new relations between parents and child)
        await con.query('TRUNCATE TABLE tree');
        const tree = JSON.parse(req.body.treeData);
        
        //2. Add Each tree tag as a row to the database using recursion
        await addTag(tree, con, null);
        
        // Commit all transactions
        await con.commit();

        return res.status(201).json({
            status: 201,
            message: 'Tree updated successfully'
        });
    } catch (e) {
        con.rollback();
        console.log(e);
    }
}
