import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

export default function ReviewCard({review}) {

  return (
    <View style={styles.card}>
      <Rating
        readonly
        startingValue={review.rating}
        imageSize={20}
        style={styles.rating}
      />
      <View style={styles.header}>
        <Text style={styles.reviewerName}>{review.reviewerName}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 10,
  },
  rating: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  comment: {
    fontSize: 14,
  },
});