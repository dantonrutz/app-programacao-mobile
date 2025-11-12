# useApi Hook

O `useApi` é um hook personalizado criado para facilitar a comunicação com o backend da aplicação. Ele encapsula as operações de requisições HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e gerencia automaticamente os cabeçalhos, incluindo o token de autenticação.

## Funcionalidades

- **Gerenciamento de cabeçalhos**: Adiciona automaticamente o token de autenticação armazenado no `AsyncStorage` aos cabeçalhos das requisições.
- **Tratamento de erros**: Lança exceções com mensagens amigáveis em caso de falha na requisição.
- **Requisições HTTP**: Suporte para os métodos `GET`, `POST`, `PUT`, `PATCH` e `DELETE`.

## Como funciona

O hook utiliza o `AsyncStorage` para recuperar o token de autenticação e adicioná-lo ao cabeçalho `Authorization`. Ele também lida com o parsing da resposta e lança erros personalizados caso a requisição falhe.

### Estrutura do Hook

```typescript
export function useApi() {
  const getHeaders = useCallback(async () => {
    const token = await AsyncStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }, []);

  const handleResponse = async (response: Response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.message || 'Erro ao fazer requisição';
      throw new Error(message);
    }
    return data;
  };

  const get = useCallback(async (endpoint: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${BACKEND_URL}${endpoint}`, { method: 'GET', headers });
    return handleResponse(response);
  }, [getHeaders]);

  // Métodos POST, PUT, PATCH e DELETE seguem a mesma estrutura...

  return { get, post, put, patch, delete: del };
}
```

## Como usar

### Passo 1: Importar o Hook

Certifique-se de importar o hook no componente onde deseja utilizá-lo.

```typescript
import { useApi } from '@/hooks/useApi';
```

### Passo 2: Utilizar os métodos do Hook

O hook retorna os métodos `get`, `post`, `put`, `patch` e `delete`, que podem ser usados para realizar requisições ao backend.

#### Exemplo de uso com `GET`

```typescript
import React, { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { View, Text, Alert } from 'react-native';

export default function ExampleScreen() {
  const { get } = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('/example-endpoint');
        setData(response);
      } catch (error: any) {
        Alert.alert('Erro', error.message);
      }
    };

    fetchData();
  }, [get]);

  return (
    <View>
      <Text>{data ? JSON.stringify(data) : 'Carregando...'}</Text>
    </View>
  );
}
```

#### Exemplo de uso com `POST`

```typescript
import React from 'react';
import { useApi } from '@/hooks/useApi';
import { View, Button, Alert } from 'react-native';

export default function ExampleScreen() {
  const { post } = useApi();

  const handlePost = async () => {
    try {
      const response = await post('/example-endpoint', { key: 'value' });
      Alert.alert('Sucesso', 'Dados enviados com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View>
      <Button title="Enviar Dados" onPress={handlePost} />
    </View>
  );
}
```

## Configuração

### Variável de Ambiente

Certifique-se de definir a variável `BACKEND_URL` no arquivo de constantes ou no `.env` para apontar para o URL do backend.

```typescript
export const BACKEND_URL = 'https://seu-backend.com/api';
```

### Token de Autenticação

O token de autenticação deve ser armazenado no `AsyncStorage` com a chave `access_token`. Por exemplo:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToken = async (token: string) => {
  await AsyncStorage.setItem('access_token', token);
};
```

## Tratamento de Erros

O `useApi` lança exceções com mensagens amigáveis em caso de erro. Certifique-se de envolver as chamadas em `try-catch` para capturar e tratar os erros.

```typescript
try {
  const data = await get('/endpoint');
} catch (error: any) {
  Alert.alert('Erro', error.message);
}
```

## Dependências

Certifique-se de instalar as dependências necessárias:

```bash
npm install @react-native-async-storage/async-storage
```

## Conclusão

O `useApi` é um hook simples e eficiente para gerenciar requisições HTTP em sua aplicação. Ele abstrai a lógica repetitiva de autenticação e tratamento de erros, permitindo que você se concentre na lógica do seu aplicativo.