import { buildRoutePath } from "../../src/utils/build-route-path";

describe('buildRoutePath', () => {
    it('should return a regex that matches the path with route params', () => {
        const path = '/users/:id';
        const routePath = buildRoutePath(path);

        const match = '/users/1'.match(routePath);

        console.log(match.groups);

        expect(routePath.test('/users/1')).toBe(true);
        expect('/users/1'.match(routePath).groups).toEqual({ id: '1', query: undefined });
        expect(routePath.test('/users/1?active=true')).toBe(true);
        expect('/users/1?active=true'.match(routePath).groups).toEqual({ id: '1', query: "?active=true" });
    });
});