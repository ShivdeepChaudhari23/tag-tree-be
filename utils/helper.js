import { v4 } from 'uuid';

export const addTag = async (tag, dbCon, parentId = null) => {
    const { name, data = null, children = [] } = tag;
    const id = v4();
    await dbCon.execute(
      'INSERT INTO tree (id, name, data, parentId) VALUES (?, ?, ?, ?)',
      [id, tag.name, tag.data, parentId]
    );
    
    // Add to the database each tag in the children array with the current tag as the parent
    if (children && children.length > 0) {
      for (const child of children) {
        await addTag(child, dbCon, id);
      }
    }
  }