import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Button,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../(store)/reducer';
import {Order} from '../(slices)/order';
import EachOrder from '@/components/EachOrder';

function Orders() {
  const orders = useSelector((state: RootState) => state.order.orders);

  const renderItem = useCallback(({item}: {item: Order}) => {
    return <EachOrder item={item} />;
  }, []);

  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>주문이 없습니다.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
  },
  eachInfo: {
    flex: 1,
    color: 'black',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default Orders;
