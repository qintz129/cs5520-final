# Book Cosmos

### Group 8
**Tianzi Qin**

github accounts: sophieqin5124/qintz129 

**Hanyi Zhou**

github accounts: hanyi-zhou

$${\color{red}Important!}$$

Since we add index on different fields in the database, the app may not work properly if you run it on your own firebase project. Please use the firebase project we provided.  
```javascript
apiKey="AIzaSyBEaicN_9yLqghPZxfbQjV6eJZq2S2Jnvc"       
authDomain="bookcosmos-2a13a.firebaseapp.com"    
projectId="bookcosmos-2a13a"    
storageBucket="bookcosmos-2a13a.appspot.com"    
messagingSenderId="1097918408997"
appId="1:1097918408997:web:43a3cacdd4549c648492cc"
googleApi="AIzaSyA9iCzWQD8xocNjStz50whB5oE9VCbXJ-Q" 
```

## Data Structure

### Overview

We have 2 main collections, books and users. In users, there are 4 subcollections in each user  file: receivedRquests, sentRequests, reviews and history.

### Fields and CRUD Operation

#### users

1. fields
    - uid: string
    - email: string
    - name: string
    - notification: boolean (false by default)
    - image: string (url) from firebase storage
    - password: string
    - books: array of string (bookId)
2. CRUD operations
    - create: create a new user
    - read: get user information
    - update: update user information: name, password and avatar

#### books

1. fields
    - author: string
    - bookName: string
    - bookNameLower: string
    - bookStatus: string (free, pending, completed)  
    - description: string
    - id: string
    - owner: string  
    - image: string (url) from firebase storage
    - location: object (including latitude and longitude)
    - address: string
2. CRUD operations
    - create: create a new book
    - read: get book information, in explore, book details, library, requests, and history page
    - update: update book information
    - delete: delete a book  

#### receivedRequests and sentRequests

If user A sends a request to user B, the request will be stored in user B's receivedRequests and user A's sentRequests.

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

#### history

If users complete or reject an exchange, the record will be stored in each user's history collections.

1. fields
    - date: string
    - fromUser: string
    - toUser: string
    - myBook: string
    - requestedBook: string
    - isReviewed: boolean (false by default)
    - status: string (completed, rejected)

2. CRUD operations:
    - create: A history will be created when both users click complete button.
    - read: Get history information in History screen.
    - update: Update the isReviewed value to true if a review is submitted by the user.

## Current Stage

Completed all CRUD operations(except for images) and navigations, 13 screens are implemented.

### Some Screenshots

![Explore-IOS](readmeFiles/Explore-IOS.jpg)
![BookDetail-IOS](readmeFiles/BookDetail-IOS.jpeg)
![OtherUserProfileReviews-IOS](readmeFiles/OtherUserProfileReviews-IOS.jpeg)
![ChooseBookModal-IOS](readmeFiles/ChooseBookModal-IOS.jpeg)
![IncomingRequests-IOS](readmeFiles/IncomingRequests-IOS.jpeg)
![OutgoingRequests-IOS](readmeFiles/OutgoingRequests-IOS.jpeg)
![UserProfileLibrary-IOS](readmeFiles/UserProfileLibrary-IOS.jpeg)
![RequestAccepted-IOS](readmeFiles/RequestAccepted-IOS.jpeg)
![RequestCompleteByOneUser-IOS](readmeFiles/RequestCompleteByOneUser-IOS.jpeg)
![RequestWaitingForCompleteByAnotherUser-IOS](readmeFiles/RequestWaitingForCompleteByAnotherUser-IOS.jpeg)
![History-IOS](readmeFiles/History-IOS.jpeg)
![AddReview-IOS](readmeFiles/AddReview-IOS.jpeg)
![Explore-Android](readmeFiles/Explore-Android.jpeg)
![BookDetail-Android](readmeFiles/BookDetail-Android.jpeg)
![IncomingRequests-Android](readmeFiles/IncomingRequests-Android.jpeg)
![OutgoingRequests-Android](readmeFiles/OutgoingRequests-Android.jpeg)
![History-Android](readmeFiles/History-Android.jpeg)
![UserProfileLibrary-Android](readmeFiles/UserProfileLibrary-Android.jpeg)

### Contribution

Tianzi Qin:

- Implement the navigation and the structure of the app.
- Implement the screens and logics: Signup, Login, IncomingRequests, OutgoingRequests, Profile, UserInfo, History, AddReview, Reviews.

Hanyi Zhou:

- Implement the screens ad logics: Explore, BookDetails, Library,  AddBook,  OtherUserProfile, ChooseBook, SendRequests, History, AddReview.
- Bugs fix, polish and platform tests.  

## Iteration 2

### Authentication

Most parts are implemented in the first iteration. We added a new modal to allow users to change their passwords.

Screenshots:

![ChangePassword](readmeFiles/ChangePassword.PNG)

### Camera use

We added a new feature to allow users to take a photo or choose a photo from the gallery to set their avatar and book covers, all pictures are stored in firebase storage.
Then we added pictures to Explore, BookDetail, Requests, History, Library and UserInfo screens.

Screenshots:

![EditUserAvatar](readmeFiles/EditUserAvatar.PNG)
![EditBookAvatar](readmeFiles/EditBookAvatar.PNG)
![ExploreImage](readmeFiles/ExploreImage.PNG)
![BookDetailImage](readmeFiles/BookDetailImage.PNG)
![RequestsImage](readmeFiles/RequestsImage.PNG)
![HistoryImage](readmeFiles/HistoryImage.PNG)
![ProfileImage](readmeFiles/ProfileImage.PNG)
![OtherUserProfileImage](readmeFiles/OtherUserProfileImage.PNG)

### Location use

We added a new feature to allow users to set the location of their books, either by typing the address or by automatically getting the current location.
Then we added an interactive map to show the number of books in a certain area. When users click on the marker, they can see the book details.

Screenshots:

![Map](readmeFiles/Map.PNG)
![BooksLocation](readmeFiles/BooksLocation.PNG)

### Notification

We added a switch button in UserInfo screen to allow users to turn on or off the notification.
Then we added a new feature to allow users to receive notifications when they send a request, if the notification function is enabled, after a certain time window, they will receive the reminder to check the status of the request. For test purpose, we set the time window to 3 seconds. When users click on the notification, they will be directed to the outgoing requests screen.

Screenshots:

![AllowNotification](readmeFiles/AllowNotification.PNG)
![Notification](readmeFiles/Notification.PNG)

### External API

1. We used google books API to get descriptions when users add a book. And users could go to the google book detailed page in the book details screen when they click on the get more info button.
2. We uses google geocoding API to get the latitude and longitude of the address users typed in and vice versa.

Screenshots:

![MapAndGoogleBooksAPI](readmeFiles/MapAndGoogleBooksAPI.PNG)
![ExternalAPI](readmeFiles/ExternalAPI.PNG)

### Others

Optimize the UI in Explore, BookDetail, Requests, History, Library and UserInfo screens.  

### Contribution

Tianzi Qin:

- Implement all camera features, including taking photos, choosing photos from the gallery, and storing photos in firebase storage.
- Implement the location feature in AddABook screen, including getting the current location, typing the address, and getting the latitude and longitude of the address.
- Implement the notification feature, including the switch button in UserInfo screen, the notification reminder.  
- Implement the google books API and google geocoding API.
- Add change password feature.

Hanyi Zhou:

- Implement the interactive map to show the user location and the number of books in a certain area. Store the book locations in firestore database. When users click on the marker, they can see the book details.
- Calculate and add distance info of books in the Explore, BookDetail and Map screens. Sort the books by distance in the Explore screen.
- Show images of books in the BookDetail, Requests and History screens. Modify the book info fields in history collection.
- Popup alerts asking for confirmation when users click all the buttons in the RequestCard.
- Present average rating info of other users in the BookDetail and OtherUserProfile screens.
