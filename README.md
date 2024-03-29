# Book Cosmos  
**Group 8**  
**Tianzi Qin** 
github accounts: sophieqin5124 qintz129 
**Hanyi Zhou** 
github accounts: hanyi-zhou
## Data Structure  
### Overview
We have 2 main collections, books and users. In users, there are 3 subcollections in each user  file: receivedRquests, sentRequests, and reviews. 

### Fields and CRUD Operations
#### users 
1. fields
    - uid: string
    - email: string
    - name: string   
2. CRUD operations
    - create: create a new user
    - read: get user information
    - update: update user information 

   
#### books  
1. fields
    - author: string 
    - bookName: string   
    - bookNameLower: string 
    - bookStatus: string (free, pending, completed)  
    - description: string 
    - id: string 
    - owner: string 
2. CRUD operations
    - create: create a new book
    - read: get book information, in explore, book details, library, requests, and history page
    - update: update book information 
    - delete: delete a book  

#### receivedRequests and sentRequests 
if user A sends a request to user B, the request will be stored in user B's receivedRequests and user A's sentRequests. 
1. fields
    - completedUser: string (all, one userId or null), to seperate the requests that is completed by one user or completed by both users
    - fromUser: string (fromUserId) 
    - toUser: string (toUserId)
    - offeredBook: string (bookId)
    - requestedBook: string (bookId)
    - requestedTime: string (timestamp) 
    - status: string (unaccepted, accepted, completed)  

2. CRUD operations
    - create: A request will be created when user A click on Send Request button and choose a book to offer
    - read: get request information in Requests tab with both incoming and outgoing requests
    - update: update request information, a request can be accepted and then completed, when a request is completed, it will enter the history page
    - delete: a request can be canceled by the sender before it is accepted, it can also be rejected by the receiver  

3. flowChart 
    ![avatar](readmeFiles/RequestStatus.png)

#### reviews 
A user can write a review for another user after a request is completed. 
1. fields
    - revieweeId: string
    - reviewerId: string
    - reviewerName: string
    - rating: number (1-5) 
    - comment: string 
    - date: string (timestamp) 
    - exchangeId: string (label each request) 
2. CRUD operations 
    - create: create a new review
    - read: get review information from reviews tab in profile page  

## Current Stage  
Completed all CRUD operations(except for images) and navigations, 13 screens are implemented.  
### Some Screenshots 


### Contribution 
Tianzi Qin: 
- Implement the navigation and the structure of the app 
- Implement the screens and logics: Signup, Login, IncomingRequests, OutgoingRequests, Profile, UserInfo, History, AddReview, Reviews 

Hanyi Zhou: 
- Implement the screens ad logics: Explore, BookDetails, Library,  AddBook,  OtherUserProfile, ChooseBook, SendRequests


