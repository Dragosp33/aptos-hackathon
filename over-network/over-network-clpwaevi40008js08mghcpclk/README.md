# Over Network – NFT-Based Social Media Platform (Move Module)

This quest features a Move smart contract for a **decentralized social media platform**. Users can create and manage accounts, follow others, and interact with posts and comments — all handled **on-chain via NFTs**.

## Account NFT Collection

- Each account is represented by an **NFT** in an "account collection".
- Collection metadata:
  - **Name**: `account collection`
  - **Description**: `account collection description`
  - **URI**: `account collection uri`
  - No royalty fee; supply is trackable.

---

## Account NFT and Metadata

Each NFT contains two resources:

- `AccountMetaData`: stores user info (username, name, bio, picture).
- `Publications`: stores posts, comments, likes.

### Validation Rules

**AccountMetaData**:

- `username`: 1–32 characters
- `name`: ≤ 60 characters
- `profile_picture_uri`: ≤ 256 characters
- `bio`: ≤ 160 characters

**Publications**:

- `post.content`: ≤ 280 characters
- `comment.content`: ≤ 280 characters

---

## Account Registry

- `AccountRegistry` maps usernames to account NFT addresses.
- Accounts are created if the username is not already registered.
- Stored in the module's `State` resource.

---

## Publications (Posts, Comments, Likes)

### Posts

- Stored in the author's `Publications`.
- Cannot be edited or deleted.

### Comments

- Stored in the commenter’s `Publications`.
- Can only comment on posts.
- Cannot be edited or deleted.

### Likes

- Stored in the liker’s `Publications`.
- One like per user per post/comment.
- Can unlike only if already liked.

---

## References Between Accounts

To avoid duplication:

- **Original data** is stored in the creator’s `Publications`.
- **References** are stored in the other user’s view of the interaction.

**Example**:

- A posts → B comments →
  - A stores post + comment reference
  - B stores comment + post reference

---

## GlobalTimeline

- A resource in the module’s **resource account**.
- Stores all post references globally.

---

## Following

- Accounts can follow/unfollow other accounts.
- Updates metadata accordingly.
- Cannot follow yourself.

---

## View Functions

### Pagination

All view functions support pagination:

- `page_size`: number of items per page
- `page`: 0-indexed page number

### Non-Aborting Behavior

Instead of aborting, view functions return:

- Empty string: `string::utf8(b"")`
- Empty vectors: `vector[]`
- Zero values for `u64`, `address`, `bool`

---

## Error Codes

| Code                              | Description                                |
| --------------------------------- | ------------------------------------------ |
| `EUsernameAlreadyRegistered`      | Username already exists                    |
| `EUsernameNotRegistered`          | Username not found                         |
| `EAccountDoesNotOwnUsername`      | Action attempted on another user’s account |
| `EBioInvalidLength`               | Bio too long                               |
| `EUserDoesNotFollowUser`          | Tried to unfollow without following        |
| `EUserFollowsUser`                | Already following user                     |
| `EPublicationDoesNotExistForUser` | Tried to act on non-existent publication   |
| `EPublicationTypeToLikeIsInvalid` | Invalid type liked                         |
| `EUserHasLikedPublication`        | Already liked this publication             |
| `EUserHasNotLikedPublication`     | Tried to unlike without liking             |
| `EUsersAreTheSame`                | Tried to follow self                       |
| `EInvalidPublicationType`         | Invalid publication type                   |
| `EUsernameInvalidLength`          | Username too long or short                 |
| `ENameInvalidLength`              | Name too long                              |
| `EProfilePictureUriInvalidLength` | Profile picture URI too long               |
| `EContentInvalidLength`           | Post or comment too long                   |

---

## Tech Summary

This Move module forms the backend logic for a **fully decentralized social platform**, using NFTs to represent accounts and storing all interactions directly on-chain.
