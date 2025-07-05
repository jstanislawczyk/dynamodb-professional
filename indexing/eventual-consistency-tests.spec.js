import { describe, it, expect } from 'vitest';
import {saveUser} from '../common/save-user.js';
import {getUsersByTeam} from '../common/get-user-by-team.js';
import {setTimeout} from 'node:timers/promises';

describe('DynamoDB tests', () => {
    const teamId = 'team-1';
    const user = {
        id: '123',
        name: 'John Doe',
        email: 'johndoe@mail.com',
        teamId,
    }

    // Other tests

    it('should read users by team', async () => {
        // Arrange
        await saveUser(user);

        // Act
        let attempts = 15;
        let usersByTeam = [];

        for (let i = 0; i < attempts; i++) {
            usersByTeam = await getUsersByTeam(teamId);

            if (usersByTeam.length > 0) {
                break;
            }

            await setTimeout(300); // Wait for eventual consistency
        }

        // Assert
        expect(usersByTeam.length).toBe(1);
    });

    // Other tests
});

