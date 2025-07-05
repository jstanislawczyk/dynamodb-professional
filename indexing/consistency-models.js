import {saveUser} from '../common/save-user.js';
import {getUserById} from '../common/get-user-by-id.js';

// IIFE to demonstrate saving and reading a user with both consistency models
(async () => {
    const user = {
        id: crypto.randomUUID(),
        name: 'John Doe',
        email: 'jdoe@examplemail.com',
    }

    await saveUser(user);

    const [
        eventualUser,
        strongUser
    ] = await Promise.all([
        // Read with eventual consistency. The user may not be immediately available.
        getUserById(user.id, false),
        // Read with strong consistency
        getUserById(user.id, true)
    ]);

    console.log('Read with eventual consistency:', eventualUser);
    console.log('Read with strong consistency:', strongUser);
})();
