import React, { useState, useEffect} from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Feather as Icon} from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'

import api from '../../services/api'

import styles from './styles'

interface Item{
  id: number,
  title: string,
  image_url: string
}

interface Point{
  id: number,
  name: string,
  image: string,
  image_url: string,
  latitude:number,
  longitude: number,
}

interface Params{
  uf: string,
  city: string
}

const Points = () => {
  
  const navigation = useNavigation()
  const route = useRoute()

  const routeParams = route.params as Params

  const [ itens, setItens ] = useState<Item[]>([])
  const [ selectedItens, setSelectedItens ] = useState<number[]>([])

  const [ points, setPoints ] = useState<Point[]>([])

  const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0,0])

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        itens:selectedItens
      }
    }).then(response => {
      setPoints(response.data)
    })
  }, [selectedItens])

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if(status !== 'granted'){
        Alert.alert('Infelizmente, precisamos de sua permissão para obter a localizaçao')
        return
      }

      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords

      setInitialPosition([
        latitude,
        longitude
      ])
    }

    loadPosition()
  }, [])


  useEffect(() => {
    api.get('itens').then(response =>{
      setItens(response.data)
    })
  }, [])

  function handleNavigateBack() {
    navigation.goBack()
  }

  function handleNavigateToDetail(id: Number) {
    navigation.navigate('Detail', {
      point_id: id
    })
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItens.findIndex(item => item === id)

    if(alreadySelected >= 0){
      const filteredItens = selectedItens.filter(item => item !== id);

      setSelectedItens(filteredItens)
    }else {
      setSelectedItens([...selectedItens, id ])
    }

  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name='arrow-left' size={24} color='#34cb79'/>
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
            <MapView 
            style={styles.map}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.02,
              longitudeDelta: 0.02
            }}
          >
            {points.map(point => (
              <Marker 
              key={String(point.id)}
              style={styles.mapMarker}
              onPress={() => handleNavigateToDetail(point.id)}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image style={styles.mapMarkerImage} source={{ uri: point.image_url}}/>
                <Text style={styles.mapMarkerTitle}>{point.name}</Text>
              </View>
            </Marker>
            ))}

          </MapView>
          ) }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          contentContainerStyle={{
            paddingHorizontal:20
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {itens.map(item => (
            <TouchableOpacity 
              activeOpacity={0.6} 
              key={String(item.id)} 
              style={[
                styles.item,
                selectedItens.includes(item.id) ? styles.selectedItem : {}
              ]} 
              onPress={() => handleSelectedItem(item.id)} 
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}          
        </ScrollView>        
      </View>
    </>
  );
}

export default Points;