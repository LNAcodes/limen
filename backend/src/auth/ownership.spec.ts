// Unit tests for the ownership rules.
// These functions are pure: no database, no mocks, no testing module needed.
// Arrange: test users below. Act + Assert: in each test.

import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../users/enums/user-role.enum.js';
import { assertIsAuthor, assertIsAuthorOrAdmin } from './ownership.js';

const authorUser = { userId: 'user-author', role: UserRole.USER };
const otherUser = { userId: 'user-other', role: UserRole.USER };
const adminUser = { userId: 'user-admin', role: UserRole.ADMIN };

// The post in all tests belongs to authorUser
const postAuthorId = authorUser.userId;

// An anonymized post has no author anymore (author was deleted, SET NULL)
const anonymizedPostAuthorId = undefined;

// assertIsAuthor (who may edit):
//   author changes own post        → expect: no error
//   other user changes the post    → expect: ForbiddenException
//   anyone changes anonymized post → expect: ForbiddenException

describe('authorIsAuthor', () => {
  it('allows the author', () => {
    expect(() => assertIsAuthor(postAuthorId, authorUser.userId)).not.toThrow();
  });

  it('forbids another user', () => {
    expect(() => assertIsAuthor(postAuthorId, otherUser.userId)).toThrow(
      ForbiddenException,
    );
  });

  it('forbids changes to an anonymized post', () => {
    expect(() =>
      assertIsAuthor(anonymizedPostAuthorId, authorUser.userId),
    ).toThrow(ForbiddenException);
  });
});

// assertIsAuthorOrAdmin (who may delete):
//   author deletes own post        → expect: no error
//   admin deletes someone's post   → expect: no error
//   other user deletes the post    → expect: ForbiddenException
//   normal user, anonymized post   → expect: ForbiddenException
//   admin, anonymized post         → expect: no error
describe('assertIsAuthorOrAdmin', () => {
  it('allows the author', () => {
    expect(() => assertIsAuthorOrAdmin(postAuthorId, authorUser)).not.toThrow();
  });

  it('allows an admin who is not the author', () => {
    expect(() => assertIsAuthorOrAdmin(postAuthorId, adminUser)).not.toThrow();
  });

  it('forbids another user', () => {
    expect(() => assertIsAuthorOrAdmin(postAuthorId, otherUser)).toThrow(
      ForbiddenException,
    );
  });

  it('forbids a normal user on an anonymized post', () => {
    expect(() =>
      assertIsAuthorOrAdmin(anonymizedPostAuthorId, otherUser),
    ).toThrow(ForbiddenException);
  });

  it('allows an admin on an anonymized post', () => {
    expect(() =>
      assertIsAuthorOrAdmin(anonymizedPostAuthorId, adminUser),
    ).not.toThrow();
  });
});
